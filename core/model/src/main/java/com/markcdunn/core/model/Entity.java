package com.markcdunn.core.model;

import java.io.Serializable;

/**
 * Interface implemented by all entities throughout the enterprise.
 */

public interface Entity
        extends Serializable {

    /**
     * Get the Id.
     * @return Id
     */
//    public String getId();

    /**
     * Set the Id.
     * @param id Id
     */
//    public void setId(String id);

    /**
     * Get the Version.
     * @return Version
     */
    public Long getVersion();

    /**
     * Set the Version.
     * @param version Version
     */
    public void setVersion(Long version);

    /**
     * Initialize a new instance of the Entity.
     */
    public void initEntity();
}
