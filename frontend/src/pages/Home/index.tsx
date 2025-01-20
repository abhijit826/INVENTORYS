import BasicChart from "./components/Basic"
import PieChartDemo from "./components/Pie"
import Line from    "./components/Lineone"
const HomePage = ()=>{

    return <div className="w-full flex flex-wrap ">
        <BasicChart/>
<Line/>
        <PieChartDemo/>

    </div>

}

export default HomePage