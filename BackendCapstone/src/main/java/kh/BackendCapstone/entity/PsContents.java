package kh.BackendCapstone.entity;

import javax.persistence.*;

public class PsContents {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long psContentId;

    @ManyToOne
    @JoinColumn(name = "psId")
    private PsWrite psWrite;

    @Column(name = "ps_title")
    private String title;

    @Column(name = "ps_content")
    private String content;
}