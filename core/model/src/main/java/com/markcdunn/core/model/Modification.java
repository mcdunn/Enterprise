package com.markcdunn.core.model;

public class Modification<I extends Entity> {

    private ModificationType type;

    private I entity;

    public void setType(ModificationType type) {
        this.type = type;
    }

    public ModificationType getType() {
        return type;
    }

    public void setEntity(I entity) {
        this.entity = entity;
    }

    public I getEntity() {
        return entity;
    }
}
