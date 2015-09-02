package com.markcdunn.core.services;

import com.markcdunn.core.utils.MessageTypeEnum;
import com.markcdunn.core.utils.StatusEnum;
import com.markcdunn.core.utils.StatusMessage;
import com.markcdunn.core.utils.StatusMessages;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Base class for service response objects.
 *
 */
public class ServiceResponseImpl
        implements ServiceResponse {

    protected StatusEnum status = StatusEnum.SUCCESS;
    protected StatusMessages statusMessages;

    public ServiceResponseImpl() {
    }

    public ServiceResponseImpl(StatusEnum status) {
        this.status = status;
    }

    public ServiceResponseImpl(StatusEnum status, StatusMessage message) {
        this.status = status;
        statusMessages = new StatusMessages(status, message);
    }

    public ServiceResponseImpl(StatusEnum status, Collection<StatusMessage> messages) {
        this.status = status;
        statusMessages = new StatusMessages(status, messages);
    }

    @Override
    public String getStatus() {
        return status != null ? status.toString() : null;
    }

    @Override
    public StatusEnum getStatusEnum() {
        return status;
    }

    @Override
    public void setStatus(StatusEnum status) {
        this.status = status;
    }

    @Override
    public void setStatusToSuccess() {
        status = StatusEnum.SUCCESS;
    }

    @Override
    public void setStatusToFailure() {
        status = StatusEnum.FAILURE;
    }

    @Override
    public boolean isSuccess() {
        return status == StatusEnum.SUCCESS;
    }

    @Override
    public boolean isFailure() {
        return status == StatusEnum.FAILURE;
    }

    @Override
    public StatusMessages getStatusMessages() {
        return statusMessages;
    }

    @Override
    public void setMessages(Collection<StatusMessage> messages) {
        statusMessages = new StatusMessages(status, messages);
    }

    @Override
    public void setMessages(MessageTypeEnum messageType, Collection<String> messages) {
        List<StatusMessage> statusMessages = new ArrayList<>();
        for (String message : messages) {
            statusMessages.add(new StatusMessage(messageType, message));
        }
        this.statusMessages = new StatusMessages(status, statusMessages);
    }


    @Override
    public void addMessage(StatusMessage message) {
        if (statusMessages == null) {
            statusMessages = new StatusMessages(status, message);
        }
        else {
            statusMessages.addMessage(message);
        }
    }

    @Override
    public void addMessage(MessageTypeEnum messageType, String message) {
        addMessage(new StatusMessage(messageType, message));
    }

    @Override
    public void clearMessages() {
        statusMessages = new StatusMessages(status);
    }

    @Override
    public String toString() {
        return "ServiceResponseImpl{" +
                "status='" + status + '\'' +
                ", statusMessages=" + statusMessages +
                '}';
    }
}