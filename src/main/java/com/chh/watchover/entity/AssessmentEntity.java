package com.chh.watchover.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment")
public class AssessmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assessmentId;

    @Column(name = "userId", nullable = false)
    private Long userId;

    @Column(name = "result")
    private String result;
}
