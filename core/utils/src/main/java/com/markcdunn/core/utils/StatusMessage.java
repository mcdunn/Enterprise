package com.markcdunn.core.utils;

/**
 * A simple message transport class containing text and a message type indicator.
 */
public class StatusMessage {

    private String message;
    private MessageTypeEnum messageType;

    /**
     * Default constructor.
     */
    public StatusMessage() {
    }

    /**
     * Constructor that takes a message and message type.
     * @param messageType message type
     * @param message message
     */
    public StatusMessage(MessageTypeEnum messageType, String message) {
        this.messageType = messageType;
        this.message = message;
    }

    /**
     * Set the message.
     * @param message message
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Get the message.
     * @return message
     */
    public String getMessage() {
        return message;
    }

    /**
     * Set the message type.
     * @param messageType message type
     */
    public void setMessageType(MessageTypeEnum messageType) {
        this.messageType = messageType;
    }

    /**
     * Get the message type.
     * @return message type
     */
    public MessageTypeEnum getMessageType() {
        return messageType;
    }

    @Override
    public String toString() {
        return "StatusMessage{" +
                "message=" + message +
                ", messageType=" + messageType +
                '}';
    }
}
