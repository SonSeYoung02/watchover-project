package com.chh.watchover.domain.assessment.model.entity;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
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
