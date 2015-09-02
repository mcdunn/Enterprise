package com.markcdunn.core.services;

import com.markcdunn.core.utils.MessageTypeEnum;
import com.markcdunn.core.utils.StatusEnum;
import com.markcdunn.core.utils.StatusMessage;
import com.markcdunn.core.utils.StatusMessages;

import java.io.Serializable;
import java.util.Collection;

public interface ServiceResponse
        extends Serializable {

    public String getStatus();

    public StatusEnum getStatusEnum();

    public void setStatus(StatusEnum statusEnum);

    public void setStatusToSuccess();

    public void setStatusToFailure();

    public boolean isSuccess();

    public boolean isFailure();

    public StatusMessages getStatusMessages();

    public void setMessages(Collection<StatusMessage> messages);

    public void setMessages(MessageTypeEnum messageType, Collection<String> messages);

    public void addMessage(MessageTypeEnum messageType, String message);

    public void addMessage(StatusMessage message);

    public void clearMessages();
}
