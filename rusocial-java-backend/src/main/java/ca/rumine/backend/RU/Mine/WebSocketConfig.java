package ca.rumine.backend.RU.Mine;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Service
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Autowired
	TokenManager tokenManager;

	@Autowired
	TopicSubscriptionInterceptor tsi;

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
	    registration.interceptors(tsi);
	}

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/mt");
    config.setApplicationDestinationPrefixes("/sm", "/mt");
    config.setUserDestinationPrefix("/mt");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/mws").withSockJS();
  }

}
