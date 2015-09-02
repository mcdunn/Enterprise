package com.markcdunn.whatever.entities;

import com.markcdunn.core.entities.BaseEntity;
import com.markcdunn.whatever.model.ValidWhatever;
import org.hibernate.id.GUIDGenerator;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "WHATEVERS")
@Access(AccessType.FIELD)
public class WhateverEntity
        extends BaseEntity<String>
        implements ValidWhatever {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "FIELD1")
    private String field1;

    @Column(name = "FIELD2")
    private String field2;

    public void initEntity() {
    }

    public String getTypedId() {
        return id;
    }

    public void setTypedId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getField1() {
        return field1;
    }

    public void setField1(String field1) {
        this.field1 = field1;
    }

    public String getField2() {
        return field2;
    }

    public void setField2(String field2) {
        this.field2 = field2;
    }
}
