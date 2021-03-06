import { dlxMatrix } from './dlxMatrix.js';

test('dlxMatrix 2x2, cell with transform assertions', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [1, 1],
      [1, 0]
    ],
    names:['A', 'B'],
    cellTransform: (cell, row, col) => Object.assign({}, cell, {row,col}),
  });
  
  expect(h.name).toBe('root');
  expect(h.l.name).toBe('B');
  expect(h.r.name).toBe('A');

  const cA = h.r;
  expect(cA.l.name).toBe('root');
  expect(cA.r.name).toBe('B');
  expect(cA.u.row).toEqual(1);
  expect(cA.u.col).toEqual(0);
  expect(cA.d.row).toEqual(0);
  expect(cA.d.col).toEqual(0);

  const cB = h.l;
  expect(cB.l.name).toBe('A');
  expect(cB.r.name).toBe('root');
  expect(cB.u.row).toEqual(0);
  expect(cB.u.col).toEqual(1);
  expect(cB.d.row).toEqual(0);
  expect(cB.d.col).toEqual(1);

  const c00 = cA.d;
  expect(c00.row).toEqual(0);
  expect(c00.col).toEqual(0);
  expect(c00.l.row).toEqual(0);
  expect(c00.l.col).toEqual(1);
  expect(c00.r.row).toEqual(0);
  expect(c00.r.col).toEqual(1);
  expect(c00.u.name).toEqual('A');
  expect(c00.d.row).toEqual(1);
  expect(c00.d.col).toEqual(0);

  const c10 = cA.u;
  expect(c10.row).toEqual(1);
  expect(c10.col).toEqual(0);
  expect(c10.l.row).toEqual(1);
  expect(c10.l.col).toEqual(0);
  expect(c10.r.row).toEqual(1);
  expect(c10.r.col).toEqual(0);
  expect(c10.u.row).toEqual(0);
  expect(c10.u.col).toEqual(0);
  expect(c10.d.name).toEqual('A');

  const c01 = cB.d;
  expect(c01.row).toEqual(0);
  expect(c01.col).toEqual(1);
  expect(c01.l.row).toEqual(0);
  expect(c01.l.col).toEqual(0);
  expect(c01.r.row).toEqual(0);
  expect(c01.r.col).toEqual(0);
  expect(c01.u.name).toEqual('B');
  expect(c01.d.name).toEqual('B');
});


test('dlxMatrix 2x2, circular reference structure is valid', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [1, 1],
      [1, 0],
    ],
    names:['A', 'B'],
  });

  const root = {}, Ca = {}, Cb = {}
  const a1= {}, a2= {}, b1= {}

  root.l = Cb; root.r = Ca; root.name = 'root'
  Ca.l = root; Ca.r = Cb; Ca.u = a2; Ca.d = a1; Ca.name = 'A'; Ca.count = 2;
  Cb.l = Ca; Cb.r = root; Cb.u = b1; Cb.d = b1; Cb.name = 'B'; Cb.count = 1;
  a1.l = b1; a1.r = b1; a1.u = Ca; a1.d = a2; a1.c = Ca;
  a2.l = a2; a2.r = a2; a2.u = a1; a2.d = Ca; a2.c = Ca;
  b1.l = a1; b1.r = a1; b1.u = Cb; b1.d = Cb; b1.c = Cb;
  expect(h).toEqual(root)
});

test('dlxMatrix 3x3', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
    ], 
    names: ['A','B','C']
  })

  const root = {}, Ca = {}, Cb = {}, Cc = {}
  const a2= {}, a3= {}, b1= {}, c1= {}, c3= {}

  root.l = Cc; root.r = Ca; root.name = 'root'
  Ca.l = root; Ca.r = Cb; Ca.u = a3; Ca.d = a2; Ca.name = 'A'; Ca.count = 2;
  Cb.l = Ca; Cb.r = Cc; Cb.u = b1; Cb.d = b1; Cb.name = 'B'; Cb.count = 1;
  Cc.l = Cb; Cc.r = root; Cc.u = c3; Cc.d = c1; Cc.name = 'C'; Cc.count = 2;
  a2.l = a2; a2.r = a2; a2.u = Ca; a2.d = a3; a2.c = Ca;
  a3.l = c3; a3.r = c3; a3.u = a2; a3.d = Ca; a3.c = Ca;
  b1.l = c1; b1.r = c1; b1.u = Cb; b1.d = Cb; b1.c = Cb;
  c1.l = b1; c1.r = b1; c1.u = Cc; c1.d = c3; c1.c = Cc;
  c3.l = a3; c3.r = a3; c3.u = c1; c3.d = Cc; c3.c = Cc;

  expect(h).toEqual(root);
});

test('uneven matrix', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [0, 0, 1, 0, 1, 1, 0],
      [1, 0, 0, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 1],
    ], 
    names: ['A','B','C', 'D', 'E', 'F', 'G'],
    cellTransform: (cell, row, col) => Object.assign({}, cell, {row,col}),
  });
  const c01 = h.r.d;
  const c02 = c01.d;
  const c12 = h.r.r.d;
  const c14 = h.r.r.d.d;

  expect(h.r.d.row).toEqual(1)
  expect(h.r.d.col).toEqual(0)
  expect(h.r.r.r.d.row).toEqual(0)
  expect(h.r.r.r.d.col).toEqual(2)
  expect(h.r.r.r.d.c.name).toEqual('C')
  expect(h.r.d.d.r.c.name).toBe('D');
});
