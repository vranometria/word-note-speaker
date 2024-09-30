class ScanCondition:
    def __init__(self) -> None:
        self.tag_ids = []
        self.attribute_values = {}
        self.filter_expression = ""

    def build(self):
        attribute_values = {}
        filter_expression = []

        if len(self.tag_ids) > 0:
            num = 0
            a = {}
            f = []
            for tag_id in self.tag_ids:
                key = f":tag{num}"
                a[key] = tag_id
                f.append(f"contains(tags, {key})")
                num += 1

            attribute_values = dict(**attribute_values, **a)
            s = " OR ".join(f)
            filter_expression.append(f"({s})")

        self.attribute_values = attribute_values
        self.filter_expression = " AND ".join(filter_expression)


    def print(self):
        print("-----------ScanCondition----------------")
        print("attribute_values: ", self.attribute_values)
        print("filter_expression: ", self.filter_expression)
        print("---------------------------")
        print()
