package com.markcdunn.whatever.transfer_objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.markcdunn.whatever.model.Whatever;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhateverModificationWrapper
        extends WhateverWrapper {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(WhateverModificationWrapper.class);

    public WhateverModificationWrapper() {
    }

    public WhateverModificationWrapper(Whatever whatever) {
        setWhatever(whatever);
    }

    public String getAdded() {
        return fields.get("modificationTypeAdded");
    }

    public void setAdded(String added) {
        fields.put("modificationTypeAdded", added);
    }
    public String getRemoved() {
        return fields.get("modificationTypeRemoved");
    }

    public void setRemoved(String removed) {
        fields.put("modificationTypeRemoved", removed);
    }
}
