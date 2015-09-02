package com.markcdunn.whatever.transfer_objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.markcdunn.whatever.model.Whatever;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhateverListWrapper {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(WhateverListWrapper.class);

    private List<WhateverWrapper> whatevers;

    public WhateverListWrapper(List<Whatever> whatevers) {
        this.whatevers = new ArrayList<>();
        for (Whatever whatever : whatevers) {
            this.whatevers.add(new WhateverWrapper(whatever));
        }
    }

    public List<WhateverWrapper> getWhatevers() {
        return whatevers;
    }
}
