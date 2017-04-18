const expect = require('chai').expect;
const Element = require('../../src/element');

const Project = require('../../src/project');
const File = require('../../src/file');
const RootElement = require('../../src/root-element');
const OrsaMetadata = require('../../src/metadata');

describe('orsa element', () => {
  it('should have no type', () => {
    const op = new Element(null);
    expect(op.type).to.equal('');
  });

  it('should convert to object', () => {
    const op = new Element(null);
    expect(op.toObject()).to.eql({
      type: '',
      metadata: {},
      children: [],
    });

    const op2 = new Element(null);
    op.children.add(op2);
    expect(op.toObject()).to.eql({
      type: '',
      metadata: {},
      children: [
        {
          type: '',
          metadata: {},
          children: [],
        },
      ],
    });
  });

  it('should have an empty children array', () => {
    const op = new Element(null);
    expect(op.children.toArray()).to.eql([]);
  });

  it('should rebroadcast metadata updates', (done) => {
    const op = new Element({
      emit: () => {},
    });
    op.on(OrsaMetadata.UPDATE, (obj, { key, value, }) => {
      expect(obj === op).to.be.true;
      expect(key).to.eql('foo');
      expect(value).to.eql('bar');
      done();
    });
    op.metadata.set('foo', 'bar');
  });

  it('should rebroadcast metadata updates', (done) => {
    const op = new Element({});
    op.on(OrsaMetadata.UPDATE, () => {
      done();
    });
    op.metadata.set('foo', 'bar');
  });

  it('should handle finding things', () => {
    const el = new Element(null, {});
    el.children.add(new Element(null, {
      fooz: 'baz',
    }));
    el.children.add(new Element(null, {
      fooz: 'baz',
    }));
    el.children.add(new Element(null, {
      fooz: 'bar',
    }));
    expect(el.find({
      metadata: {
        fooz: 'baz',
      },
    }).length).to.eql(2);
  });

  it('should handle initial metadata', () => {
    const op = new Element(null, {
      foo: 'bar',
    });
    expect(op.metadata.toObject()).to.eql({
      foo: 'bar',
    });
  });

  it('should handle high level save', () => {
    const re = new RootElement(null, {});

    const p1 = new Project(re, {});
    p1.name = 'foo';
    re.children.add(p1);

    const p2 = new Project(re, {});
    p2.name = 'bar';
    re.children.add(p2);

    const f1 = new File(p1, {});
    p1.children.add(f1);

    expect(re.save().children.length).to.eql(2);
  });

  it('should handle high level save and restore', () => {
    const re = new RootElement(null, {});
    const p1 = new Project(re, {});
    p1.name = 'foo';
    re.children.add(p1);

    const p2 = new Project(re, {});
    p2.name = 'bar';
    re.children.add(p2);

    const f1 = new File(p1, {});
    p1.children.add(f1);
    expect(re.children.toArray().length).to.eql(2);

    const re2 = new RootElement(null, {});
    re2.restore(re.save());

    expect(re2.children.toArray().length).to.eql(2);
  });

  it('should send an error on a wonky restore', (done) => {
    const re = new RootElement(null, {});
    re.on(RootElement.RESTORE_ERROR, (obj, err) => {
      expect(obj === re).to.be.true;
      expect(err).to.eql('fooz is unknown');
      done();
    });
    re.restore({
      type: '',
      children: [
        {
          type: 'fooz',
        },
      ],
    });
  });

  it('should match on metadata', () => {
    const op = new Element(null, {
      fooz: 'baz',
    });
    op.path = 'blah';
    expect(op.match({
      path: 'blah',
    })).to.be.true;
    expect(op.match({
      metadata: {
        fooz: 'baz',
      },
    })).to.be.true;
    expect(op.match({
      metadata: {
        fooz: 'bar',
        foo: 'bar',
      },
      black: 'mass',
    })).to.be.false;
    expect(op.match({
      metadata: {
        foo: 'bar',
      },
    })).to.be.false;
    expect(op.match({
      type: 'enchilada',
      metadata: {
        foo: 'bar',
      },
    })).to.be.false;
  });
});
