package com.markcdunn.core.services;

import com.markcdunn.core.model.Entity;
import com.markcdunn.core.utils.StatusEnum;
import com.markcdunn.core.utils.StatusMessage;

import java.util.Collection;

// TODO: change toString to use a base implementation that uses Jackson
public class EntityModificationResponse<E extends Entity>
    extends ServiceResponseImpl {

    private final E entity;

    public EntityModificationResponse(E entity, StatusEnum status) {
        super(status);
        this.entity = entity;
    }

    public EntityModificationResponse(E entity, StatusEnum status, StatusMessage message) {
        super(status, message);
        this.entity = entity;
    }

    public EntityModificationResponse(E entity, StatusEnum status, Collection<StatusMessage> messages) {
        super(status, messages);
        this.entity = entity;
    }

    public E getEntity() {
        return entity;
    }

    /**
     * (@inheritDoc)
     */
    @Override
    public String toString() {
        return "EntityModificationResponse{" +
                "entity=" + entity +
                ", [" + super.toString() + "]" +
                '}';
    }
}
