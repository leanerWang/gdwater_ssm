package cn.xin.domain.massage;


import lombok.Data;
import org.springframework.stereotype.Component;

//卡片界面的信息类
@Component("cardMassage")
@Data
public class CardMassage {

    private int code = 0; //状态 0为真 1为假，始终为真,除非状态改变

    private String massage;

    private String linkAddress;

    private String linkName;


}
