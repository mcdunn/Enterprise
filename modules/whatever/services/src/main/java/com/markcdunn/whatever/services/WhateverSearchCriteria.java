package com.markcdunn.whatever.services;

import com.markcdunn.core.daos.search.BaseSearchCriteria;
import com.markcdunn.whatever.model.Whatever;

import java.util.Map;

public class WhateverSearchCriteria
        extends BaseSearchCriteria<Whatever> {

    private String id;
    private String field1;
    private String field2;

    public WhateverSearchCriteria() {
    }

    public WhateverSearchCriteria(Map<String, String> values) {
        applyValues(values);
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

    public void applyValues(Map<String, String> values) {
        super.applyValues(values);
        setId(values.get("id"));
        setField1(values.get("field1"));
        setField2(values.get("field2"));
    }
}
