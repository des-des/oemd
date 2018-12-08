const test = require("tape");

const parse = require("./parse.js");
const tests = [
  {
    name: "single character",
    md: "x",
    expected: {
      tag: "p",
      attrs: {},
      children: [
        {
          tag: "text",
          attrs: {},
          children: "x"
        }
      ]
    }
  },
  {
    name: "single character",
    md: " x",
    expected: {
      tag: "p",
      attrs: {},
      children: [
        {
          tag: "text",
          attrs: {},
          children: " x"
        }
      ]
    },
    only: true
  },
  {
    name: "title",
    md: "# x",
    expected: {
      tag: "h1",
      attrs: {},
      children: [
        {
          tag: "text",
          attrs: {},
          children: "# "
        },
        {
          tag: "text",
          attrs: {},
          children: "x"
        }
      ]
    }
  },
  {
    name: "title2",
    md: "## x",
    expected: {
      tag: "h2",
      attrs: {},
      children: [
        {
          tag: "text",
          attrs: {},
          children: "## "
        },
        {
          tag: "text",
          attrs: {},
          children: "x"
        }
      ]
    }
  },
  {
    name: "bold",
    md: "**x**",
    expected: {
      tag: "p",
      attrs: {},
      children: [
        {
          tag: "strong",
          attrs: {},
          children: [
            {
              tag: "text",
              attrs: {},
              children: "**x**"
            }
          ]
        }
      ]
    }
  }
  // {
  //   name: "bold error case 1",
  //   md: "* *x**",
  //   expected: {
  //     tag: "paragraph",
  //     attrs: {},
  //     children: [
  //       {
  //         tag: "text",
  //         attrs: {},
  //         children: "* *x**"
  //       }
  //     ]
  //   }
  // }
];

tests.forEach(testCase => {
  const result = parse(testCase.md);

  test(testCase.name, t => {
    t.notEqual(result.length, 0, "result found");

    if (result.length) {
      t.deepEqual(result[0], testCase.expected, "match");
    } else {
      console.log(result);
    }
    t.end();
  });
});
