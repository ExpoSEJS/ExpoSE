import Config from "./Config";
import Default from "./Strategies/Default";
import Deterministic from "./Strategies/Deterministic";
import Random from "./Strategies/Random";
import BucketsDeterministic from "./Strategies/BucketsDeterministic";

export default (function () {
  const strat = Config.testStrategy;
  switch (strat) {
    case "default":
      return Default;
    case "deterministic":
      return Deterministic;
    case "buckets_deterministic":
      return BucketsDeterministic;
    case "random":
      return Random;
    default:
      throw "Strategy Error";
  }
})();
