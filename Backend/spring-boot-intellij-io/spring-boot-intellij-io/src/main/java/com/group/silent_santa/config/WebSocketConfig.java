 package com.group.silent_santa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker to send messages to clients
        // on destinations prefixed with /topic (for broadcasts) and /queue (for specific users)
        config.enableSimpleBroker("/topic", "/queue");

        // Set prefix for messages from clients to server
        config.setApplicationDestinationPrefixes("/app");

        // Enable user-specific messages with this prefix
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoints with SockJS fallback options
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200") // Your Angular app URL
                .withSockJS();
    }
}