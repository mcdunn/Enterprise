package com.markcdunn.whatever.querydsl;

import com.markcdunn.core.daos.querydsl.BaseQueryDslSearch;
import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SortOrderList;
import com.markcdunn.whatever.entities.QWhateverEntity;
import com.markcdunn.whatever.entities.WhateverEntity;
import com.markcdunn.whatever.model.Whatever;
import com.markcdunn.whatever.services.WhateverSearchCriteria;
import com.mysema.query.jpa.impl.JPAQuery;
import com.mysema.query.types.EntityPath;

public class WhateverQueryDslSearch
        extends BaseQueryDslSearch<Whatever, WhateverEntity, String> {

    private QWhateverEntity path = QWhateverEntity.whateverEntity;

    /**
     * Applies WhateverSearchCriteria to a QueryDSL JPAQuery object
     *
     * @param query JPAQuery object to add criteria to
     * @param searchCriteria the search criteria to use while searching
     */
    @Override
    protected void addSearchCriteria(JPAQuery query, SearchCriteria<Whatever> searchCriteria) {

        WhateverSearchCriteria whateverSearchCriteria = (WhateverSearchCriteria) searchCriteria;

        // Add ID filter
        String id = whateverSearchCriteria.getId();
        if (id != null) {
            query.where(path.id.eq(id));
        }

        // Add Field1 filter
        String field1 = whateverSearchCriteria.getField1();
        if (field1 != null) {
            query.where(path.field1.eq(field1));
        }

        // Add Field2 filter
        String field2 = whateverSearchCriteria.getField2();
        if (field2 != null) {
            query.where(path.field2.eq(field2));
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected EntityPath<WhateverEntity> getEntityPath() {
        return path;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected SortOrderList filterSortOrderList(SortOrderList sortOrderList) {
        return sortOrderList;
    }
}
