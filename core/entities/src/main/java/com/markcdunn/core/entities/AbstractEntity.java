package com.markcdunn.core.entities;

import com.markcdunn.core.model.Entity;
import com.markcdunn.core.model.Unique;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import java.util.UUID;

@MappedSuperclass
public abstract class AbstractEntity
        implements Entity, Unique<String> {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private static final Long CURRENT_VERSION = 1l;

    @Id
    @Column(name = "ID", unique = true, nullable = false, length = 36)
    protected String id;

    @Version
    @Column(name = "VERSION", nullable = false)
    protected Long version = CURRENT_VERSION;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTypedId() {
        return getId();
    }
    
    public void setTypedId(String id) {
        setId(id);
    }
    
    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    /**
     * Create a new instance of an entity.
     *
     * @return new instance of the entity
     */
//    public static AbstractEntity newInstance() {
//        return null;
//    }

    /**
     * Create a new instance of an entity.
     *
     * @return new instance of the entity
     */
    public static <AE extends AbstractEntity> AbstractEntity newInstance(Class<AE> clazz) {
        AE newInstance;
        try {
            newInstance = clazz.newInstance();
            newInstance.initEntity();
            return newInstance;
        } catch (InstantiationException e) {
            // Handle this?
        } catch (IllegalAccessException e) {
            // Handle this?
        }

        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void initEntity() {
        setId(UUID.randomUUID().toString());
    }

    public String toString() {
        return "id='" + id + '\'' +
               ", version='" + version + '\'';
    }
}
