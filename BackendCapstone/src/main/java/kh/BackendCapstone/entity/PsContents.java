package kh.BackendCapstone.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
@Table(name = "ps_contents")
public class PsContents {
    // 자기소개서 항목 id
    @Id
    @JoinColumn(name = "ps_contents_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long psContentsId;

    // 자기소개서 id
    @ManyToOne
    @JoinColumn(name = "ps_write_id")
    private PsWrite psWrite;

    // 항목 제목
    @Column(name = "ps_title")
    private String psTitle;

    // 항목 내용
    @Column(name = "ps_content")
    private String psContent;
}