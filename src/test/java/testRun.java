import org.junit.Test;

import java.util.ArrayList;

public class testRun {
    public static void main(String[] args) {
        testRunnable runnable1 = new testRunnable();
        testRunnable runnable2 = new testRunnable();
        String i;
        i = "thread1";
        runnable1.setName(i);
        runnable1.run();
        i = "thread2";
        runnable2.setName(i);
        runnable2.run();
        System.out.println("hhhhhhh..");
    }

    @Test
    public void testFuZhi(){
        ArrayList<String> a = new ArrayList();
        ArrayList<String> b = new ArrayList();
        a =  b;
        System.out.println(a);
        System.out.println(b);
    }
}
