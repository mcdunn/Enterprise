package com.markcdunn.whatever.daos;

import com.markcdunn.core.daos.BaseDao;
import com.markcdunn.core.daos.search.Search;
import com.markcdunn.whatever.entities.WhateverEntity;
import com.markcdunn.whatever.model.Whatever;

public class WhateverDao
        extends BaseDao<Whatever, WhateverEntity, String> {

    public WhateverDao() {
        super(WhateverEntity.class);
    }

    public void setSearch(Search<Whatever> whateverSearch) {
        super.setSearch(whateverSearch);
    }
}
