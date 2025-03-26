package com.edusuite.educlass.model;

import java.util.List;

public class PagedResult<T> {
    public final List<T> items;
    public final PageInfo pageInfo;

    public PagedResult(List<T> items, PageInfo pageInfo) {
        this.items = items;
        this.pageInfo = pageInfo;
    }

    public static class PageInfo {
        private boolean hasNextPage;
        private String endCursor;

        public PageInfo(boolean hasNextPage, String endCursor) {
            this.hasNextPage = hasNextPage;
            this.endCursor = endCursor;
        }

        public boolean isHasNextPage() {
            return hasNextPage;
        }

        public void setHasNextPage(boolean hasNextPage) {
            this.hasNextPage = hasNextPage;
        }

        public String getEndCursor() {
            return endCursor;
        }

        public void setEndCursor(String endCursor) {
            this.endCursor = endCursor;
        }
    }
}
