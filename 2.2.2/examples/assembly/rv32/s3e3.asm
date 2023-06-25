#
# WepSIM (https://wepsim.github.io/wepsim/)
#

.kdata
   vector:  .word rt_i0
            .word rt_div0
            .word rt_sys

   msgi0:   .string "INT: 0\n"
   msgi1:   .string "FPE: */0\n"

.ktext
sys_print:  li   zero 0
            li   t5 1
            beq  t3 zero end1
        b5: lb   t4 0(t3)
            beq  t4 zero end1
            out  t4 0x1000
            add  t3 t3 t5
            beq  zero zero  b5
      end1: sret

  rt_i0:
            # 1.- interruption
            li   t3  msgi0
            beq  zero zero  sys_print

  rt_div0:
            # 2.- exception
            li   t3  msgi1
            beq  zero zero  sys_print

  rt_sys:
            # 3.- ecall
            mv   t3  a0
            li   t4  4
            beq  a7  t4 sys_print
            sret

.data
    helloworld: .string "hello world...\n"

.text
    main:  # test div 0/0
           li  t0 0
           li  t1 0
           div t1 t1 t0

           # the end
           jr ra

