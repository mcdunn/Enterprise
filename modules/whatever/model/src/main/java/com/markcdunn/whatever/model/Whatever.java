package com.markcdunn.whatever.model;

import com.markcdunn.core.model.Entity;

public interface Whatever
        extends Entity {

    public String getId();
    public void setId(String id);

    public String getField1();
    public void setField1(String field1);

    public String getField2();
    public void setField2(String field2);
}
