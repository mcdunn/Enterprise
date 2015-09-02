package com.markcdunn.whatever.spring;

import com.markcdunn.core.spring.responses.ModifyResponse;
import com.markcdunn.whatever.model.Whatever;
import com.markcdunn.whatever.transfer_objects.WhateverWrapper;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class WhateverModificationsResponse
        extends ModifyResponse {

    private List<WhateverWrapper> whatevers;

    public WhateverModificationsResponse(Collection<Whatever> whatevers) {
        List<WhateverWrapper> whateverWrappers = new ArrayList<>();
        for (Whatever whatever : whatevers) {
            whateverWrappers.add(new WhateverWrapper(whatever));
        }
        this.whatevers = whateverWrappers;
    }

    public List<WhateverWrapper> getWhatevers() {
        return whatevers;
    }

    public void setWhatevers(List<WhateverWrapper> whatevers) {
        this.whatevers = whatevers;
    }
}
