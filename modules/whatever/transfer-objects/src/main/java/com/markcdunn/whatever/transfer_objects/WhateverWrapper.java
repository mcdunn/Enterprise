package com.markcdunn.whatever.transfer_objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.markcdunn.core.transfer_objects.BaseWrapper;
import com.markcdunn.whatever.model.Whatever;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhateverWrapper
        extends BaseWrapper<Whatever> {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(WhateverWrapper.class);

    protected Map<String, String> fields = new HashMap<>();

    public WhateverWrapper() {
    }

    public WhateverWrapper(Whatever whatever) {
        setWhatever(whatever);
    }

    @JsonProperty
    public String getId() {
        return fields.get("id");
    }

    //TODO: add @JsonIgnore, service clients should not be able to set ids themselves when saving
    public void setId(String id) {
        fields.put("id", id);
    }

    public String getField1() {
        return fields.get("field1");
    }

    public void setField1(String field1) {
        fields.put("field1", field1);
    }

    public String getField2() {
        return fields.get("field2");
    }

    public void setField2(String field2) {
        fields.put("field2", field2);
    }

    public Whatever getWhatever(Whatever whatever) {
        whatever.setId(fields.get("id"));
        whatever.setField1(fields.get("field1"));
        whatever.setField2(fields.get("field2"));
        return whatever;
    }

    public void setWhatever(Whatever whatever) {
        fields.put("id", whatever.getId());
        fields.put("field1", whatever.getField1());
        fields.put("field2", whatever.getField2());
    }
}
