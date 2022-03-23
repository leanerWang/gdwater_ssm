

public class testRunnable implements Runnable {
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(name+"run...");

        }
    }

}
