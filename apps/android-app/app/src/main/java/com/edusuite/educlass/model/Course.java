package com.edusuite.educlass.model;

import java.util.Objects;

public class Course {
    private final String id;
    private final String name;
    private final String section;
    private final String room;
    private final String subject;
    private final String code;

    public Course(String id, String name, String section, String room, String subject, String code) {
        this.id = id;
        this.name = name;
        this.section = section;
        this.room = room;
        this.subject = subject;
        this.code = code;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSection() {
        return section;
    }

    public String getRoom() {
        return room;
    }

    public String getSubject() {
        return subject;
    }

    public String getCode() {
        return code;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Course course = (Course) obj;
        return id.equals(course.id) && name.equals(course.name) && room.equals(course.room);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, room);
    }
}
