package com.markcdunn.core.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * A container for a collection of messages (as well as their types) to be displayed to the users.
 */
public class StatusMessages {

    private final StatusEnum status;
    private final List<StatusMessage> messages = new ArrayList<>();

    /**
     * Constructor that takes a status.
     */
    public StatusMessages(StatusEnum status) {
        this.status = status;
    }

    /**
     * Constructor that takes a status and a single Status Message Entry.
     * @param status status of the operation that caused this Status Message
     * @param message message to display
     */
    public StatusMessages(StatusEnum status, StatusMessage message) {
        this.status = status;
        messages.add(message);
    }

    /**
     * Constructor that takes a status and a list of Status Message Entries.
     * @param status status of the operation
     * @param messages list of messages to display
     */
    public StatusMessages(StatusEnum status, Collection<StatusMessage> messages) {
        this.status = status;
        this.messages.addAll(messages);
    }

    /**
     * Get the status.
     * @return status
     */
    public StatusEnum getStatus() {
        return status;
    }

    /**
     * Get the list of messages.
     * @return list of messages
     */
    public List<StatusMessage> getMessages() {
        return messages;
    }

    /**
     * Add a message to the list of messages to display.
     * @param message message to add to the list
     */
    public void addMessage(StatusMessage message) {
        if (message != null) {
            messages.add(message);
        }
    }

    /**
     * Add a list of messages to the list of messages to display.
     * @param messages list of messages to add to the list
     */
    public void addMessages(Collection<StatusMessage> messages) {
        if (messages != null) {
            this.messages.addAll(messages);
        }
    }

    /**
     * Return <code>true</code> if this Status Message resulted from a success.
     *
     * @return <code>true</code> if this Status Message resulted from a success, otherwise<code>false</code>
     */
    public boolean isSuccess() {
        return status.isSuccess();
    }

    /**
     * Return <code>true</code> if this Status Message resulted from a failure.
     *
     * @return <code>true</code> if this Status Message resulted from a failure, otherwise<code>false</code>
     */
    public boolean isFailure() {
        return status.isFailure();
    }

    /**
     * (@inheritDoc)
     */
    @Override
    public String toString() {
        return "StatusMessages{" +
                "status=" + status +
                ", messages=" + messages +
                '}';
    }
}
