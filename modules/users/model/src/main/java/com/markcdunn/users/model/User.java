package com.markcdunn.users.model;

import com.markcdunn.core.model.Entity;

public interface User
        extends Entity {

    public String getId();
    public void setId(String id);

    public String getFirstName();
    public void setFirstName(String firstName);

    public String getLastName();
    public void setLastName(String lastName);
}
