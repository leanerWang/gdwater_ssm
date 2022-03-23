package cn.xin.domain.database;

//对应postgresql的box字段

/**
 * Generic version of the Box class.
 * @param <T> the type of the value being boxed
 */
public class Box<T> {


    // T stands for "Type"
    private T west;
    private T south;
    private T east;
    private T north;


    public  Box(T west, T south, T east, T north){
        this.west = west;
        this.south =south;
        this.east = east;
        this.north = north;
    }

    public T getWest() {
        return west;
    }

    public void setWest(T west) {
        this.west = west;
    }

    public T getSouth() {
        return south;
    }

    public void setSouth(T south) {
        this.south = south;
    }

    public T getEast() {
        return east;
    }

    public void setEast(T east) {
        this.east = east;
    }

    public T getNorth() {
        return north;
    }

    public void setNorth(T north) {
        this.north = north;
    }

    @Override
    public String toString() {
        return "Box{" +
                "west=" + west +
                ", south=" + south +
                ", east=" + east +
                ", north=" + north +
                '}';
    }
}


