import { OnInit, Component, Injector } from '@angular/core';
import { Validators } from "@angular/forms";

import { Entry } from './../shared/entry.model';
import { EntryService } from './../shared/entry.service';

import { Category } from './../../categories/shared/category.model';
import { CategoryService } from './../../categories/shared/category.service';

import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Category[];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  constructor(protected entryService: EntryService, protected categoryService: CategoryService, protected injector: Injector) {
    super(injector, new Entry, entryService, Entry.fromJson)
  }

  ngOnInit() {
    this.loadCategories();
    super.ngOnInit();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => {
      return {
        text: text,
        value: value
      }
    })
  }
  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, [Validators.required, Validators.maxLength(250)]],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    })
  }

  protected loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  protected creationPageTitle(): string {
    return "Cadastro de Novo Lançamento"
  }

  protected editionPageTitle(): string {
    const resourceName = this.resource.name;
    return `Editando Lançamento ${resourceName}`;
  }
}
