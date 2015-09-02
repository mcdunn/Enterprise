package com.markcdunn.whatever.spring;

import com.markcdunn.core.spring.responses.ModifyResponse;
import com.markcdunn.whatever.transfer_objects.WhateverWrapper;

public class WhateverModifyResponse
        extends ModifyResponse {

    private WhateverWrapper whatever;

    public WhateverModifyResponse(WhateverWrapper whatever) {
        this.whatever = whatever;
    }

    public WhateverWrapper getWhatever() {
        return whatever;
    }

    public void setWhatever(WhateverWrapper whatever) {
        this.whatever = whatever;
    }
}
