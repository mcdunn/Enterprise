package com.markcdunn.whatever.transfer_objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.markcdunn.core.model.Modification;
import com.markcdunn.core.model.ModificationType;
import com.markcdunn.whatever.model.Whatever;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhateverModificationsWrapper {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(WhateverModificationsWrapper.class);

    private List<WhateverModificationWrapper> whateverModifications;

    public WhateverModificationsWrapper() {
    };

    public WhateverModificationsWrapper(List<WhateverModificationWrapper> whateverModifications) {
        this.whateverModifications = whateverModifications;
    }

    public List<WhateverModificationWrapper> getModifications() {
        return whateverModifications;
    }
}
