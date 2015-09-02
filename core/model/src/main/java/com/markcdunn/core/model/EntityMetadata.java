package com.markcdunn.core.model;

import java.util.Date;


public interface EntityMetadata {

    public void setCreateTimestamp(Date ts);

    public Date getCreateTimestamp();

    public void setCreateUser(String user);

    public String getCreateUser();

    public void setUpdateUser(String user);

    public String getUpdateUser();

    public void setUpdateTimestamp(Date ts);

    public Date getUpdateTimestamp();

    public void initMetadata(String userId);

    public void updateMetadata(EntityMetadata source, String userId);
}
