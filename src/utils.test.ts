import 'mocha';
import * as chai from 'chai';

import { compareVersions, getLatest } from '../src/utils';

describe('compareVersions', () => {
  it('should correctly compare two simple versions', () => {
    chai.expect(compareVersions('1', '2')).to.equal(-1);
    chai.expect(compareVersions('2', '1')).to.equal(1);
    chai.expect(compareVersions('1', '1')).to.equal(0);
  });
  it('works with major.minor version numbers', () => {
    chai.expect(compareVersions('1.5', '2.1')).to.equal(-1);
    chai.expect(compareVersions('2.2', '1.5')).to.equal(1);
  });
  it('works with major.minor.patch verison numbers', () => {
    chai.expect(compareVersions('1.5.1', '2.1.3')).to.equal(-1);
  });
});
