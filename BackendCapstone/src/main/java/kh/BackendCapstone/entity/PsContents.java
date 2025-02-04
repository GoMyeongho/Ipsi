package kh.BackendCapstone.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "ps_contents")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PsContents {
    // 자기소개서 항목 id
    @Id
    @Column(name = "ps_contents_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long psContentsId;

    // 자기소개서 id
    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "ps_write_id")
    private PsWrite psWrite;

    // 항목 제목
    @Column(name = "ps_title")
    private String psTitle;

    // 항목 내용
    @Column(name = "ps_content")
    private String psContent;

    // 항목 번호
    @Column(name = "sections_num")
    private Integer sectionsNum;
}