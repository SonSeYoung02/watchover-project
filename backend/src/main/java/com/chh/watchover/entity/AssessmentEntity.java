package com.chh.watchover.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment")
public class AssessmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assessmentId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;

    @Column(name = "result")
    private String result;
}
