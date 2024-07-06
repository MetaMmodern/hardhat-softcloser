// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";

// import sinon from "sinon";
import { SoftCloser } from "../src/SoftCloser";
import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the softcloser class to hre", function () {
      assert.instanceOf(this.hre.softcloser, SoftCloser);
    });

    // it("The example field should say hello", function () {
    //   assert.equal(this.hre.example.sayHello(), "hello");
    // });
  });

  //   describe("HardhatConfig extension", function () {
  //     useEnvironment("hardhat-project");

  //     it("Should add the newPath to the config", function () {
  //       assert.equal(
  //         this.hre.config.paths.newPath,
  //         path.join(process.cwd(), "asd"),
  //       );
  //     });
  //   });
  // });
});
