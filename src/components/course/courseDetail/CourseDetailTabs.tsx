import { Tabs } from "antd";

const CourseDetailTabs = ({
  items,
  description,
  learningPoints,
}: {
  items: any[];
  description: string;
  learningPoints: string[];
}) => {
  const fullItems = items.map((item) => {
    if (item.key === "overview") {
      return {
        ...item,
        children: (
          <>
            <p className="text-gray-700 leading-relaxed">{description}</p>
            <div className="mt-4">
              <h3 className="font-medium text-lg mb-2">What You’ll Learn</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {learningPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </>
        ),
      };
    }
    return item;
  });

  return <Tabs defaultActiveKey="overview" items={fullItems} className="mt-6" />;
};

export default CourseDetailTabs;
