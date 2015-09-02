package com.markcdunn.whatever.services.impl;

import com.markcdunn.core.services.BaseDataService;
import com.markcdunn.whatever.entities.WhateverEntity;
import com.markcdunn.whatever.model.Whatever;
import com.markcdunn.whatever.services.WhateverDataService;

public class WhateverDataServiceImpl
        extends BaseDataService<Whatever, WhateverEntity, String>
        implements WhateverDataService {

    public WhateverDataServiceImpl() {
        super(WhateverEntity.class);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void generateNewId(Whatever whatever) {
        whatever.setId(Long.toString(Math.round(Math.random() * 100000)));
    }
}
