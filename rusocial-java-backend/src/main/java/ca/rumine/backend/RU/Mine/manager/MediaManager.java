package ca.rumine.backend.RU.Mine.manager;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.apache.tika.config.TikaConfig;
import org.apache.tika.detect.Detector;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.mime.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.model.UploadedImage;
import ca.rumine.backend.RU.Mine.repository.ImageRepository;

import org.im4java.core.ConvertCmd;
import org.im4java.core.IMOperation;
import org.im4java.process.ProcessStarter;

@Service
public class MediaManager {
	
	@Autowired
	private ImageRepository imageRepository;
	
	@Value("${imageSaveLocation}")
	private String imageSaveLocation;
	
	@Value("${imageMagickToolPath}")
	private String imageMagickToolPath;
	

	public String getFormat(byte[] byteStream, String filename) throws IOException {
		
		TikaConfig config = TikaConfig.getDefaultConfig();
		Detector detector = config.getDetector();

		TikaInputStream stream = TikaInputStream.get(byteStream);

		Metadata metadata = new Metadata();
		metadata.add(Metadata.RESOURCE_NAME_KEY, filename);
		MediaType mediaType = detector.detect(stream, metadata);
		
		String fileType = mediaType.toString();
		
		return fileType;
	
		
	}
	
	public Boolean isValidFormat(String fileType) {
		if(fileType.equals("image/png") || fileType.equals("image/jpg") || fileType.equals("image/jpeg")) {
			System.out.println("Allowing this media");
			return true;
		}
		else {
			System.out.println("Not allowed");
			return false;
		}
	}
	
	public String saveMedia(byte[] byteStream, String userid, String ip, String fileType, Integer type) throws IOException {
		Gson gson = new Gson();
		//Type is a numerical representation of the two media types. 1 is picture, 2 is video.

		//Generate new image name
		String name = getSaltString(16) + "_" + new Date().getTime();
		//Generate reference
		String reference = getSaltString(4) + "-" + getSaltString(8) + "-" + new Date().getTime();
		
		Path path = Paths.get(imageSaveLocation + name);
		Files.write(path, byteStream);
		Boolean compressed = false;
		try {
			ProcessStarter.setGlobalSearchPath(imageMagickToolPath);
			
            // create command
            ConvertCmd cmd = new ConvertCmd();
            
            //Saving at 85% quality
            IMOperation op = new IMOperation();
            op.addImage(imageSaveLocation + name);
            op.quality(85.0);
            op.autoOrient();
            op.strip();
            op.interlace("PLANE");
            op.colorspace("RGB");
            op.gaussianBlur(0.05);
            op.density(220);
            
            try {
            	InputStream in = new ByteArrayInputStream(byteStream);
                BufferedImage buf = ImageIO.read(in);
                int width = buf.getWidth();
                
                if(width > 1200) {
                	//Reduce to 1920
                	System.out.println("Executing adaptive resize");
                	op.adaptiveResize(1200);
                }
            }
            catch(Exception e) {
            	e.printStackTrace();
            	System.out.println("Failed buffer image");
            }
            
            op.addImage(imageSaveLocation + name + "_o");

            // execute the operation
    		cmd.run(op);
    		compressed = true;

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		//Write media to db
		UploadedImage image = new UploadedImage();
		image.setUserid(userid);
		image.setImgid(reference);
		image.setUploaded(new Date());
		image.setDeleted(false);
		image.setData(name);
		image.setFileType(fileType);
		image.setType(type);
		image.setCompressed(compressed);
		imageRepository.save(image);
		
		
		System.out.println("Should be saved to disk");
		
		return reference;
	}
	
	protected String getSaltString(int length) {
        String SALTCHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < length) { // length of the random string.
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;

    }

	public Integer getType(String fileType) {
		if(fileType.equals("image/png") || fileType.equals("image/jpg") || fileType.equals("image/jpeg")) {
			//Image
			return 1;
		}
		else if(fileType.equals("image/gif") || fileType.equals("video/mp4")
				|| fileType.equals("image/mov") || fileType.equals("video/quicktime") || fileType.equals("video/x-quicktime")
				|| fileType.equals("image/mov") || fileType.equals("video/avi")) {
			//Video
			return 2;
		}
		else {
			//Text
			return 0;
		}
	}

}
