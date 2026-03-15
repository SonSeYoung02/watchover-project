package com.chh.watchover.entity;

import com.chh.watchover.entity.enums.Type;
import jakarta.persistence.*;

@Entity
@Table(name = "item")
public class ItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "image", nullable = false, columnDefinition = "VARCHAR(512)")
    private String image;

    @Column(name = "price", nullable = false)
    private Long price;
}
