package com.edusuite.educlass.model;

public class Course {
    private String id;
    private String name;
    private String subtitle;

    public Course(String id, String name, String subtitle) {
        this.id = id;
        this.name = name;
        this.subtitle = subtitle;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }
}
