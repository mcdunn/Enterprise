package com.markcdunn.core.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Version;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.markcdunn.core.model.Unique;

/**
 * Abstract base class for all JPA Entities.
 * 
 * This class provides the JPA version and id properties.
 * 
 * FIXME consider moving all the id and initEntity logic into CoreEntity, which
 * would let this class better accomodate other subclassed Entities which use
 * different id strategies.
 * 
 * @author gtassone
 * 
 */
public abstract class BaseEntity<K>
        implements Unique<K>, Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final Long CURRENT_VERSION = 1l;

	@Version
	@Column(name = "VERSION", nullable = false)
	protected Long version = CURRENT_VERSION;

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
	public static <T extends BaseEntity<?>> T newInstance(Class<T> clazz) {
        T newInstance;
		try {
			newInstance = clazz.newInstance();
			newInstance.initEntity();
			return newInstance;
        }
        catch (InstantiationException e) {
		}
        catch (IllegalAccessException e) {
		}
		return null;
	}

	/**
	 * Called via BaseEntity.newInstance() to initialize the Entity with any
	 * custom setup - id generation, contained Entity instantiation and wiring,
	 * etc.
	 */
	protected abstract void initEntity();

	public String toString() {
        try {
            return new ObjectMapper().writer().writeValueAsString(this);
        }
        catch (Exception e) {
            return "id='" + getTypedId() + '\'' + ", version='" + version + '\'' + e;
        }
	}

}
