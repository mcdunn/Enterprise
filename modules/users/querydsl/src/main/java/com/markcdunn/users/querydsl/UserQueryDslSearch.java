package com.markcdunn.users.querydsl;

import com.markcdunn.core.daos.querydsl.BaseQueryDslSearch;
import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SortOrderList;
import com.markcdunn.users.entities.QUserEntity;
import com.markcdunn.users.entities.UserEntity;
import com.markcdunn.users.model.User;
import com.markcdunn.users.services.UserSearchCriteria;
import com.mysema.query.jpa.impl.JPAQuery;
import com.mysema.query.types.EntityPath;

public class UserQueryDslSearch
        extends BaseQueryDslSearch<User, UserEntity, String> {

    private QUserEntity path = QUserEntity.userEntity;

    /**
     * Applies UserSearchCriteria to a QueryDSL JPAQuery object
     *
     * @param query JPAQuery object to add criteria to
     * @param searchCriteria the search criteria to use while searching
     */
    @Override
    protected void addSearchCriteria(JPAQuery query, SearchCriteria<User> searchCriteria) {

        UserSearchCriteria userSearchCriteria = (UserSearchCriteria) searchCriteria;

        // Add ID filter
        String id = userSearchCriteria.getId();
        if (id != null) {
            query.where(path.id.eq(id));
        }

        // Add First Name filter
        String firstName = userSearchCriteria.getFirstName();
        if (firstName != null) {
            query.where(path.firstName.eq(firstName));
        }

        // Add Last Name filter
        String lastName = userSearchCriteria.getLastName();
        if (lastName != null) {
            query.where(path.lastName.eq(lastName));
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected EntityPath<UserEntity> getEntityPath() {
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
