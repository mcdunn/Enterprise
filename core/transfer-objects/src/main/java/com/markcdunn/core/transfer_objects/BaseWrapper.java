package com.markcdunn.core.transfer_objects;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.markcdunn.core.model.Entity;

public class BaseWrapper<I extends Entity> {

    public String toString() {
        try {
            return new ObjectMapper().writer().writeValueAsString(this);
        }
        catch (Exception e) {
            return super.toString();
        }
    }
}
