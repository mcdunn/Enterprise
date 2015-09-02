package com.markcdunn.whatever.spring;

import com.markcdunn.core.spring.responses.CreateResponse;
import com.markcdunn.whatever.transfer_objects.WhateverWrapper;

public class WhateverCreateResponse
        extends CreateResponse {

    private WhateverWrapper whatever;

    public WhateverCreateResponse(WhateverWrapper whatever) {
        this.whatever = whatever;
    }

    public WhateverWrapper getWhatever() {
        return whatever;
    }

    public void setWhatever(WhateverWrapper whatever) {
        this.whatever = whatever;
    }
}
